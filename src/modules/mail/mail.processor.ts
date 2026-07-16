import { Process,Processor } from "@nestjs/bull";
import { Job } from "bull";
import { MailerService } from "@nestjs-modules/mailer";
import { join } from 'path';

@Processor('email')
export class MailProcessor{

    constructor (private readonly mailerService:MailerService){
        //console.log('MailProcessor Initailized')
    }



    @Process('bulk-email')
    async handleBroadcast(job: Job) {
    const { email, firstName, message, subject } = job.data;

    const personalizedMessage = message.replace(/{name}/g, firstName);

    try {
        await this.mailerService.sendMail({
            to: email,
            subject,
            template: join(__dirname, 'templates', 'broadcast_email'),
            context: {
                firstName,
                message: personalizedMessage,
            },
        });
        console.log(`Email sent successfully to ${email}`);
        return { success: true, email };
    } catch (error) {
        console.error(`Failed to send to ${email}`, error);
        throw error;
    }
}
}