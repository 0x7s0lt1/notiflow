export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export const isHttpMethod = (method: string): method is HttpMethod => {
    return Object.values(HttpMethod).includes(method as HttpMethod);
};