import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface UserPreferences {
        context: string;
        budget: string;
        styles: string[];
    }

    interface Session {
        user: {
            id: string;
            role: string;
            onboarded: boolean;
            preferences?: UserPreferences;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
        onboarded: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        onboarded: boolean;
    }
}
