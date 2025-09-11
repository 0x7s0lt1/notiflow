import {HttpMethod} from "@/types/HttpMethod";

type WebhookType = {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    payload?: Record<string, string>;
}

export default WebhookType;