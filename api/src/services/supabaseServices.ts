import { createClient } from "@supabase/supabase-js";
import { access } from "fs";

const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseKey: string = process.env.SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  static supabaseRegisterUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  static supabaseLoginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  static supabaseIsUserAuthenticated = async (
    token: string,
  ): Promise<string> => {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) throw error;
    return data.user.email!;
  };
}

export default SupabaseService;
