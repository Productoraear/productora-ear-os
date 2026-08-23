/**
 * 🎧 UNIVERSAL CUE BRIDGE (S-Class v4.7)
 * Parser Universal de historiales de sesión DJ y reportes de ejecución pública.
 * Soporta: Rekordbox, Serato DJ, Traktor Pro, VirtualDJ y Denon Engine (.m3u, .csv, .xml, .nml, .txt).
 */

export interface ParsedTrack {
  orderIndex: number;
  title: string;
  artist: string;
  durationSeconds?: number;
  durationFormatted?: string;
  playedAt?: string;
  genre?: string;
  bpm?: number;
  isrc?: string;
  confidence: number; // 0 to 1
  sourceFormat: 'REKORDBOX' | 'SERATO' | 'TRAKTOR' | 'VIRTUALDJ' | 'DENON_ENGINE' | 'GENERIC_M3U' | 'UNKNOWN';
}

export interface CueSessionReport {
  sessionId: string;
  softwareDetected: 'REKORDBOX' | 'SERATO' | 'TRAKTOR' | 'VIRTUALDJ' | 'DENON_ENGINE' | 'GENERIC_M3U' | 'UNKNOWN';
  totalTracks: number;
  totalDurationSeconds: number;
  totalDurationFormatted: string;
  startTime?: string;
  endTime?: string;
  tracks: ParsedTrack[];
  parsedAt: string;
  rawFileName?: string;
}

export class UniversalCueBridge {
  /**
   * Parsea cualquier archivo de historial DJ reconociendo automáticamente la estructura y el software de origen.
   */
  public static parse(content: string, fileName: string = 'session_history'): CueSessionReport {
    const cleanContent = content.trim();
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    let tracks: ParsedTrack[] = [];
    let detectedSoftware: CueSessionReport['softwareDetected'] = 'UNKNOWN';

    // 1. XML / NML Detection (Traktor / Rekordbox XML)
    if (cleanContent.startsWith('<?xml') || cleanContent.includes('<NML') || cleanContent.includes('<DJ_PLAYLISTS') || ext === 'nml' || ext === 'xml') {
      if (cleanContent.includes('<NML') || cleanContent.includes('TRAKTOR')) {
        detectedSoftware = 'TRAKTOR';
        tracks = this.parseTraktorXml(cleanContent);
      } else if (cleanContent.includes('<DJ_PLAYLISTS') || cleanContent.includes('rekordbox')) {
        detectedSoftware = 'REKORDBOX';
        tracks = this.parseRekordboxXml(cleanContent);
      } else {
        tracks = this.parseGenericXml(cleanContent);
      }
    }
    // 2. M3U / M3U8 Playlist
    else if (cleanContent.startsWith('#EXTM3U') || ext === 'm3u' || ext === 'm3u8') {
      if (cleanContent.includes('#EXTVDJ')) {
        detectedSoftware = 'VIRTUALDJ';
      } else {
        detectedSoftware = 'GENERIC_M3U';
      }
      tracks = this.parseM3U(cleanContent);
    }
    // 3. CSV Formats (Serato, Denon, Rekordbox CSV)
    else if (ext === 'csv' || cleanContent.includes(',') || cleanContent.includes(';')) {
      const firstLine = cleanContent.split('\n')[0].toLowerCase();
      if (firstLine.includes('serato') || (firstLine.includes('name') && firstLine.includes('play time'))) {
        detectedSoftware = 'SERATO';
        tracks = this.parseSeratoCsv(cleanContent);
      } else if (firstLine.includes('engine') || firstLine.includes('denon')) {
        detectedSoftware = 'DENON_ENGINE';
        tracks = this.parseDenonCsv(cleanContent);
      } else if (firstLine.includes('track title') || firstLine.includes('artist')) {
        detectedSoftware = 'REKORDBOX';
        tracks = this.parseDelimitedText(cleanContent, ',');
      } else {
        tracks = this.parseGenericCsv(cleanContent);
      }
    }
    // 4. Tab-Delimited or Plain Text (Rekordbox Export .txt, Serato History .txt)
    else {
      if (cleanContent.includes('\t') && (cleanContent.toLowerCase().includes('track title') || cleanContent.toLowerCase().includes('artist'))) {
        detectedSoftware = 'REKORDBOX';
        tracks = this.parseDelimitedText(cleanContent, '\t');
      } else {
        detectedSoftware = 'VIRTUALDJ';
        tracks = this.parsePlainTextLines(cleanContent);
      }
    }

    const totalSeconds = tracks.reduce((acc, t) => acc + (t.durationSeconds || 180), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const durationFormatted = hours > 0 
      ? `${hours}h ${minutes}m ${seconds}s` 
      : `${minutes}m ${seconds}s`;

    return {
      sessionId: `CUE-${Date.now().toString(36).toUpperCase()}`,
      softwareDetected: detectedSoftware,
      totalTracks: tracks.length,
      totalDurationSeconds: totalSeconds,
      totalDurationFormatted: durationFormatted,
      tracks,
      parsedAt: new Date().toISOString(),
      rawFileName: fileName
    };
  }

  // --- REKORDBOX XML PARSER ---
  private static parseRekordboxXml(xml: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const trackMatches = xml.matchAll(/<TRACK\s+([^>]+)>/gi);
    let idx = 1;

    for (const match of trackMatches) {
      const attrs = match[1];
      const name = this.extractXmlAttr(attrs, 'Name') || this.extractXmlAttr(attrs, 'Title') || 'Pista Desconocida';
      const artist = this.extractXmlAttr(attrs, 'Artist') || 'Artista No Identificado';
      const totalTime = parseInt(this.extractXmlAttr(attrs, 'TotalTime') || '180', 10);
      const bpm = parseFloat(this.extractXmlAttr(attrs, 'AverageBpm') || '0');
      const genre = this.extractXmlAttr(attrs, 'Genre') || 'Dance / House';

      tracks.push({
        orderIndex: idx++,
        title: name,
        artist: artist,
        durationSeconds: totalTime,
        durationFormatted: `${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`,
        bpm: bpm > 0 ? bpm : undefined,
        genre,
        confidence: 0.98,
        sourceFormat: 'REKORDBOX'
      });
    }
    return tracks;
  }

  // --- TRAKTOR NML PARSER ---
  private static parseTraktorXml(nml: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const entryMatches = nml.matchAll(/<ENTRY\s+([^>]+)>(?:[\s\S]*?<INFO\s+([^>]+)>)?/gi);
    let idx = 1;

    for (const match of entryMatches) {
      const entryAttrs = match[1];
      const infoAttrs = match[2] || '';
      
      const title = this.extractXmlAttr(entryAttrs, 'TITLE') || 'Pista Desconocida';
      const artist = this.extractXmlAttr(entryAttrs, 'ARTIST') || 'Artista No Identificado';
      const playTime = parseInt(this.extractXmlAttr(infoAttrs, 'PLAYTIME') || '180', 10);
      const genre = this.extractXmlAttr(infoAttrs, 'GENRE') || 'Club / Directo';

      tracks.push({
        orderIndex: idx++,
        title,
        artist,
        durationSeconds: playTime,
        durationFormatted: `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`,
        genre,
        confidence: 0.97,
        sourceFormat: 'TRAKTOR'
      });
    }
    return tracks;
  }

  // --- GENERIC XML PARSER ---
  private static parseGenericXml(xml: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const items = xml.matchAll(/<(?:track|song|item)[\s\S]*?>([\s\S]*?)<\/(?:track|song|item)>/gi);
    let idx = 1;

    for (const item of items) {
      const block = item[1];
      const titleMatch = block.match(/<(?:title|name)>([^<]+)<\/(?:title|name)>/i);
      const artistMatch = block.match(/<(?:artist|creator)>([^<]+)<\/(?:artist|creator)>/i);

      if (titleMatch) {
        tracks.push({
          orderIndex: idx++,
          title: titleMatch[1].trim(),
          artist: artistMatch ? artistMatch[1].trim() : 'Artista No Identificado',
          durationSeconds: 180,
          confidence: 0.85,
          sourceFormat: 'UNKNOWN'
        });
      }
    }
    return tracks;
  }

  // --- M3U / M3U8 PARSER ---
  private static parseM3U(content: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const lines = content.split('\n');
    let idx = 1;
    let softwareDetected: ParsedTrack['sourceFormat'] = content.includes('#EXTVDJ') ? 'VIRTUALDJ' : 'GENERIC_M3U';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        const info = line.substring(8);
        const commaIdx = info.indexOf(',');
        const seconds = commaIdx !== -1 ? parseInt(info.substring(0, commaIdx), 10) : 180;
        const trackString = commaIdx !== -1 ? info.substring(commaIdx + 1).trim() : info.trim();

        const { artist, title } = this.cleanArtistAndTitle(trackString);

        tracks.push({
          orderIndex: idx++,
          title,
          artist,
          durationSeconds: isNaN(seconds) || seconds <= 0 ? 180 : seconds,
          durationFormatted: `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
          confidence: 0.96,
          sourceFormat: softwareDetected
        });
      } else if (!line.startsWith('#') && line.length > 3) {
        // Direct file path in M3U (e.g. G:\Adalberto Santiago - Super Apollo 47_50 - 01-05 Dios Me Libre.flac)
        const filename = line.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, '') || line;
        const { artist, title } = this.cleanArtistAndTitle(filename);

        tracks.push({
          orderIndex: idx++,
          title,
          artist,
          durationSeconds: 240,
          durationFormatted: '4:00',
          confidence: 0.95,
          sourceFormat: softwareDetected
        });
      }
    }
    return tracks;
  }

  // --- SERATO CSV PARSER ---
  private static parseSeratoCsv(csv: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const lines = csv.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return tracks;

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('song') || h.includes('title'));
    const artistIdx = headers.findIndex(h => h.includes('artist'));
    const timeIdx = headers.findIndex(h => h.includes('play time') || h.includes('time') || h.includes('duration'));

    let order = 1;
    for (let i = 1; i < lines.length; i++) {
      const row = this.parseCsvRow(lines[i]);
      if (row.length > nameIdx && nameIdx !== -1 && row[nameIdx]?.trim()) {
        const title = row[nameIdx]?.trim();
        const artist = (artistIdx !== -1 && row[artistIdx]?.trim()) ? row[artistIdx]?.trim() : 'Artista No Identificado';
        const timeStr = timeIdx !== -1 ? row[timeIdx]?.trim() : '3:00';
        const sec = this.parseTimeStringToSeconds(timeStr);

        tracks.push({
          orderIndex: order++,
          title,
          artist,
          durationSeconds: sec,
          durationFormatted: timeStr,
          confidence: 0.96,
          sourceFormat: 'SERATO'
        });
      }
    }
    return tracks;
  }

  // --- DENON ENGINE CSV PARSER ---
  private static parseDenonCsv(csv: string): ParsedTrack[] {
    return this.parseSeratoCsv(csv);
  }

  // --- TAB / COMMA DELIMITED TEXT (Rekordbox txt export) ---
  private static parseDelimitedText(content: string, delimiter: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return tracks;

    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(delimiter).map(h => h.trim().replace(/"/g, ''));

    const titleIdx = headers.findIndex(h => h.includes('track title') || h.includes('title') || h.includes('nombre') || h.includes('song'));
    const artistIdx = headers.findIndex(h => h.includes('artist') || h.includes('artista'));
    const bpmIdx = headers.findIndex(h => h.includes('bpm'));
    const timeIdx = headers.findIndex(h => h.includes('time') || h.includes('duration') || h.includes('duración'));

    let order = 1;
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
      if (titleIdx !== -1 && cols[titleIdx]) {
        const title = cols[titleIdx];
        const artist = artistIdx !== -1 && cols[artistIdx] ? cols[artistIdx] : 'Artista No Identificado';
        const bpm = bpmIdx !== -1 ? parseFloat(cols[bpmIdx]) : undefined;
        const timeStr = timeIdx !== -1 ? cols[timeIdx] : '3:00';
        const sec = this.parseTimeStringToSeconds(timeStr);

        tracks.push({
          orderIndex: order++,
          title,
          artist,
          bpm: !isNaN(bpm || NaN) ? bpm : undefined,
          durationSeconds: sec,
          durationFormatted: timeStr,
          confidence: 0.98,
          sourceFormat: 'REKORDBOX'
        });
      }
    }
    return tracks;
  }

  // --- GENERIC CSV FALLBACK ---
  private static parseGenericCsv(csv: string): ParsedTrack[] {
    return this.parseDelimitedText(csv, csv.includes(';') ? ';' : ',');
  }

  // --- PLAIN TEXT LINES PARSER ---
  private static parsePlainTextLines(text: string): ParsedTrack[] {
    const tracks: ParsedTrack[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    let order = 1;

    for (const line of lines) {
      if (line.startsWith('#') || line.toLowerCase().includes('playlist') || line.toLowerCase().includes('tracklist')) continue;

      let artist = 'Artista No Identificado';
      let title = line;

      // Detect "1. Artist - Title" or "Artist - Title"
      const cleanedLine = line.replace(/^[0-9]+[\.\-\)\s]+/, '').trim();
      if (cleanedLine.includes(' - ')) {
        const parts = cleanedLine.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      tracks.push({
        orderIndex: order++,
        title,
        artist,
        durationSeconds: 180,
        confidence: 0.88,
        sourceFormat: 'VIRTUALDJ'
      });
    }
    return tracks;
  }

  // --- UTILITY HELPERS ---
  private static extractXmlAttr(attrString: string, attrName: string): string | null {
    const regex = new RegExp(`${attrName}=["']([^"']+)["']`, 'i');
    const match = attrString.match(regex);
    return match ? match[1] : null;
  }

  private static parseCsvRow(rowStr: string): string[] {
    const result: string[] = [];
    let inQuotes = false;
    let current = '';

    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  }

  private static parseTimeStringToSeconds(timeStr: string): number {
    if (!timeStr) return 180;
    const parts = timeStr.split(':').map(p => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 180;
  }

  public static cleanArtistAndTitle(rawString: string): { artist: string; title: string } {
    let text = rawString.trim();
    // Remove leading numbering like "1. ", "01 - "
    text = text.replace(/^[0-9]+[\.\-\)\s_]+/, '').trim();

    let artist = 'Artista No Identificado';
    let title = text;

    if (text.includes(' - ')) {
      const parts = text.split(' - ').map(p => p.trim());
      artist = parts[0];
      
      // If 3 parts like "Adalberto Santiago - Super Apollo 47_50 - 01-05 Dios Me Libre"
      if (parts.length >= 3) {
        const lastPart = parts[parts.length - 1];
        // Clean track numbers like "01-05 Dios Me Libre" -> "Dios Me Libre"
        title = lastPart.replace(/^[0-9]+[\-_][0-9]+\s*/, '').replace(/^[0-9]+\s*/, '').trim();
      } else {
        title = parts[1].replace(/^[0-9]+[\-_][0-9]+\s*/, '').replace(/^[0-9]+\s*/, '').trim();
      }
    }

    return { artist, title };
  }
}
