import AppleLogin from "../apple-login";
import { supabaseMain } from '@/lib/supabase'


export default function AppleLoginLive(){
    return(
        <AppleLogin client={supabaseMain} />
    )
}