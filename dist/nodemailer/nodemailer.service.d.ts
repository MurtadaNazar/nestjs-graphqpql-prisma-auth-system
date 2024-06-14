export declare class NodemailerService {
    private transporter;
    constructor();
    sendMail(to: string, subject: string, text: string): Promise<void>;
}
