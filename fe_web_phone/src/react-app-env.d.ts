/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_URL: string;
    readonly REACT_APP_GOOGLE_CLIENT_ID: string;
    readonly REACT_APP_FB_ID: string;
    readonly REACT_APP_REDIRECT_URI:string;
  }
}