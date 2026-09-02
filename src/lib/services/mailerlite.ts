/**
 * 📧 MAILERLITE S-CLASS MARKETING & NURTURING SERVICE (EAR OS V2)
 * Manages subscriber groups, automated nurturing sequences, and the 150 € Discount Voucher.
 */

export interface MailerLiteSubscriber {
  email: string;
  name: string;
  fields?: {
    phone?: string;
    city?: string;
    occasion?: string;
    budget_estimate?: number;
    coupon_code?: string;
    dossier_url?: string;
  };
  groups?: string[];
}

export class MailerLiteService {
  private static getApiKey(): string {
    return (process.env.MAILERLITE_API_KEY || '').replace(/['"]/g, '').trim();
  }

  private static getGroupId(): string {
    return (process.env.MAILERLITE_GROUP_ID_LEADS || '').replace(/['"]/g, '').trim();
  }

  /**
   * Añade o actualiza un suscriptor en MailerLite y le asigna el grupo de bienvenida con cupón de 150€.
   */
  public static async addSubscriber(subscriber: MailerLiteSubscriber): Promise<{ success: boolean; message: string }> {
    const apiKey = this.getApiKey();
    const defaultGroup = this.getGroupId();

    if (!apiKey) {
      console.log(`📧 [MAILERLITE SIMULATION] Suscriptor registrado en memoria: ${subscriber.name} (${subscriber.email}) - Cupón: EAR150-VIP`);
      return { success: true, message: 'Simulación: Lead registrado en pipeline MailerLite.' };
    }

    try {
      const groups = subscriber.groups || (defaultGroup ? [defaultGroup] : []);
      const payload: any = {
        email: subscriber.email,
        fields: {
          name: subscriber.name,
          phone: subscriber.fields?.phone || '',
          city: subscriber.fields?.city || 'Madrid',
          company: subscriber.fields?.occasion || 'Particular',
          ...subscriber.fields
        }
      };

      if (groups.length > 0) {
        payload.groups = groups;
      }

      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log(`✅ [MAILERLITE API] Suscriptor añadido con éxito: ${subscriber.email}`);
        return { success: true, message: 'Suscriptor sincronizado en MailerLite.' };
      } else {
        const errorText = await res.text();
        console.warn('⚠️ [MAILERLITE WARNING]:', errorText);
        return { success: false, message: `Error en MailerLite: ${errorText}` };
      }
    } catch (err: any) {
      console.error('❌ [MAILERLITE ERROR]:', err);
      return { success: false, message: err.message };
    }
  }
}
