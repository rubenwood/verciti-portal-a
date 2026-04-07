import AppleLogin from "../apple-login";
import { supabaseTest } from '@/lib/supabase'

export default function AppleLoginTest(){
    return(
        <AppleLogin client={supabaseTest} />
    )
}