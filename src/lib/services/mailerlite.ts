/**
 * 📧 MAILERLITE STUB SERVICE (S-CLASS STANDARD)
 */

export interface MailerLiteSubscriber {
  email: string;
  name?: string;
  fields?: Record<string, any>;
  groups?: string[];
}

export class MailerLiteService {
  public static async addSubscriber(subscriber: MailerLiteSubscriber): Promise<{ success: boolean; message: string }> {
    console.log(`[MAILERLITE STUB] Subscriber registered: ${subscriber.email}`);
    return { success: true, message: 'Subscriber ingested successfully.' };
  }

  public static async subscribe(email: string, name?: string): Promise<boolean> {
    console.log(`[MAILERLITE STUB] Subscribed: ${email} (${name})`);
    return true;
  }

  public static async sendEvent(eventName: string, data?: any): Promise<boolean> {
    console.log(`[MAILERLITE STUB] Event tracked: ${eventName}`, data);
    return true;
  }
}

export default MailerLiteService;
