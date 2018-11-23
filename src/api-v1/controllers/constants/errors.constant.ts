export class ErrorsConstant {
    public static message = {
        default_error: "Error",
        mail_exists: "Mail exists",
        hashing_error: "",
        signup_error: "Signup error",
        auth_error: "Auth failed",
        not_found: ""
    };

    public static code = {
        default_error: "500",
        mail_exists: "409",
        hashing_error: "500",
        signup_error: "404",
        auth_error: "401",
        not_found: "404"
    }
}