// Redirect signup to the unified auth page
import { redirect } from "next/navigation";

export default function SignupPage() {
    redirect("/auth/login");
}
