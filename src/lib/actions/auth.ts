"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
});

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { fieldErrors };
  }

  const { name, email, password } = parsed.data;

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return { error: "Já existe uma conta com esse e-mail." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const role = adminEmail && adminEmail === email.toLowerCase() ? "admin" : "user";

    await User.create({
      name,
      email,
      passwordHash,
      role,
      acceptedTermsAt: new Date(),
    });

    return { success: true };
  } catch (err) {
    console.error("registerUser error:", err);
    return {
      error:
        "Não foi possível criar a conta. Verifique a conexão com o banco e tente novamente.",
    };
  }
}
