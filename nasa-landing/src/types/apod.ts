export interface Apod {
    date: string;
    explanation: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    service_version: string;
    title: string;
    url: string;
}
export type ApodData = Apod;