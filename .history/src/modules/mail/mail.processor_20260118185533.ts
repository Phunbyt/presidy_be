import { Process,Processor } from "@nestjs/bull";
import { Job } from "bull";
import { MailerService } from "@nestjs-modules/mailer";
import { join } from 'path';

@Processor('email')
export class MailProcessor{

    constructor (private readonly mailerService:MailerService){}


    @Process('broadcast')
    async handleBroadcast(job:Job){
        const {email,firstname,message} = job.data;

        try{
            await this.mailerService.sendMail({
                to:email,
                subject:'A broadcast from Presidy',
                template: join(__dirname, 'templates', 'broadcast_email'),
                context:{
                    name:firstname,
                    message:message,
                }
    
            })
            console.log(`Email sent successfully to ${email}`)
            return {success:true, email}
        }catch(error){
            console.error(`Failed to send to ${email}`, error.message || error)
            throw error;
        }

    
    } 
}