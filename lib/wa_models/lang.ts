import CONFIG from '../../config';  

type Language = {
    fb_msg: string;
    fb_invalid: string;
    insta_msg: string; insta_invalid: string;
    tiktok_msg: string; tiktok_invalid: string;
    ytdl_msg: string; ytdl_invalid: string;
    ytmp3_msg: string; ytmp3_invalid: string;
    error_msg: string;
    gpt_msg: string;  seegro_msg: string;
    snack_msg: string; ytpost_url: string;
    git_msg: string; soundcloud: string;
    apk_msg: string; capcut_msg: string;
    fullpp_msg: string; deepseek_msg: string;
    reboot_msg: string; update_now: string; bypass: string; pass: string;
    send: string; complete: string; wait_msg: string;
}; 

const languages: Record<string, Language> = {
    en: {
        fb_msg: "Please provide a Facebook url",
        fb_invalid: "Invalid Facebook URL provided",
        insta_msg: "Please provide an Instagram url",
        insta_invalid: "Invalid Instagram URL provided",
        tiktok_msg: "Please provide a TikTok url",
        tiktok_invalid: "Invalid TikTok url provided",
        ytdl_msg: "Please provide a song name",
        ytdl_invalid: "Invalid sorry_",
        pass: "Extracting passwords...",
        ytmp3_msg: "Please provide an YouTube url",
        bypass: "Bypassing firewalls...",
        ytmp3_invalid: "_Provide a valid url_",
        error_msg: "An error occurred. Please try again later",
        gpt_msg: "What would you like me to do?",
        deepseek_msg: "Hello lm DeepSeek R-1 how can l assist you😊",
        seegro_msg: "Please provide a SeeGero url",
        snack_msg: "Please provide a SnackVideo url",
        wait_msg: "Please wait a sec...",
        mention_user: "Please mention a user",
        ytpost_url: "Please provide the YouTube post url",
        git_msg: "Please provide the GitHub repository url",
        soundcloud: "Please provide a SoundCloud url",
        apk_msg: "Please provide an APK name",
        capcut_msg: "Please provide a CapCut url",
        send: "Sending data to server...",
        complete: "Hacking complete 😈👿☠️",
        fullpp_msg: "Please provide the image",
        reboot_msg: "Rebooting...",
        update_now: "Please wait currently updating"

    },
    zulu: {
        fb_msg: "Sicela unikeze i-URL ye-Facebook",
        fb_invalid: "I-URL ye-Facebook enikeziwe ayilungile",
        insta_msg: "Sicela unikeze i-URL ye-Instagram",
        insta_invalid: "I-URL ye-Instagram enikeziwe ayilungile",
        tiktok_msg: "Sicela unikeze i-URL ye-TikTok",
        tiktok_invalid: "I-URL ye-TikTok enikeziwe ayilungile",
        ytdl_msg: "Sicela unikeze i-URL ye-YouTube",
        ytdl_invalid: "I-URL ye-YouTube enikeziwe ayilungile",
      ytmp3_msg: "Cela unikeze i-url ye youtube",
      ytmp3_invalid: "_i url oyinikile ayilungang_",
        error_msg: "Kuvele iphutha. Ngicela uzame futhi",
        gpt_msg: "Ufunani ukuthi ngikwenzeleni?",
        deepseek_msg: "Sawubona igama lami nguDeepSeek R-1 ngingaksiza ngani😊",
        seegro_msg: "Sicela unikeze i-URL ye-SeeGero",
        snack_msg: "Sicela unikeze i-URL ye-SnackVideo",
        ytpost_url: "Sicela unikeze i-URL ye-YouTube post",
        git_msg: "Sicela unikeze i-URL ye-Github repo",
        soundcloud_msg: "Sicela unikeze i-URL ye-SoundCloud",
        apk_msg: "Sicela unikeze igama leApp",
        capcut_msg: "Sicela unikeze i-URL ye-CapCu",
        wait_msg: "Cela ume kancane...",
        fullpp_msg: "Sicela unikeze isthombe",
        reboot_msg: "Ima kancane ngisa-rebooter...",
        update_now: "Cela ume kancane ngisa updater"
    },
    sotho: {
        fb_msg: "Ka kopo fana ka URL ea Facebook",
        fb_invalid: "URL ea Facebook ha e sebetse",
        insta_msg: "Ka kopo fana ka URL ea Instagram",
        insta_invalid: "URL ea Instagram ha e sebetse",
        tiktok_msg: "Ka kopo fana ka URL ea TikTok",
        tiktok_invalid: "URL ea TikTok ha e sebetse",
        ytdl_msg: "Ka kopo fana ka URL ea YouTube",
        ytdl_invalid: "URL ea YouTube ha e sebetse",
        error_msg: "Ho na le phoso. Ka kopo leka hape",
        gpt: "O batla ke etse'ng?"
        
    },
    pedi: {
        fb_msg: "Ka kgopela o neele URL ya Facebook",
        fb_invalid: "URL ya Facebook ga e a loka",
        insta_msg: "Ka kgopela o neele URL ya Instagram",
        insta_invalid: "URL ya Instagram ga e a loka",
        tiktok_msg: "Ka kgopela o neele URL ya TikTok",
        tiktok_invalid: "URL ya TikTok ga e a loka",
        ytdl_msg: "Ka kgopela o neele URL ya YouTube",
        ytdl_invalid: "URL ya YouTube ga e a loka",
        error_msg: "Go diragetse phošo. Ka kgopela leka gape",
        gpt: "O nyaka ke dire eng?"
    },
    shona: {
        fb_msg: "Ndokumbira upe URL yeFacebook",
        fb_invalid: "URL yeFacebook yawapa haina kunaka",
        insta_msg: "Ndokumbira upe URL yeInstagram",
        insta_invalid: "URL yeInstagram yawapa haina kunaka",
        tiktok_msg: "Ndokumbira upe URL yeTikTok",
        tiktok_invalid: "URL yeTikTok yawapa haina kunaka",
        ytdl_msg: "Ndokumbira upe URL yeYouTube",
        ytdl_invalid: "URL yeYouTube yawapa haina kunaka",
        error_msg: "Pane dambudziko. Ndokumbira uedze zvakare",
        gpt: "Unoda kuti ndiitei?",
        reboot_msg: "Rebooting...",
        update_now: "Mira kashoma ndiri ku-updater"
    },
    indo: {
        fb_msg: "Silakan berikan URL Facebook",
        fb_invalid: "URL Facebook yang diberikan tidak valid",
        insta_msg: "Silakan berikan URL Instagram",
        insta_invalid: "URL Instagram yang diberikan tidak valid",
        tiktok_msg: "Silakan berikan URL TikTok",
        tiktok_invalid: "URL TikTok yang diberikan tidak valid",
        ytdl_msg: "Silakan berikan URL YouTube",
        ytdl_invalid: "URL YouTube yang diberikan tidak valid",
        error_msg: "Terjadi kesalahan. Silakan coba lagi nanti",
        gpt: "Apa yang bisa saya bantu?"
    },
    urdu: {
        fb_msg: "براہ کرم فیس بک کا یو آر ایل فراہم کریں۔",
        fb_invalid: "غلط فیس بک یو آر ایل فراہم کیا گیا ہے۔",
        insta_msg: "براہ کرم انسٹاگرام کا یو آر ایل فراہم کریں۔",
        insta_invalid: "غلط انسٹاگرام یو آر ایل فراہم کیا گیا ہے۔",
        tiktok_msg: "براہ کرم ٹک ٹاک کا یو آر ایل فراہم کریں۔",
        tiktok_invalid: "غلط ٹک ٹاک یو آر ایل فراہم کیا گیا ہے۔",
        ytdl_msg: "براہ کرم یوٹیوب کا یو آر ایل فراہم کریں۔",
        ytdl_invalid: "غلط یوٹیوب یو آر ایل فراہم کیا گیا ہے۔",
        error_msg: "ایک خرابی پیش آگئی ہے۔ براہ کرم دوبارہ کوشش کریں۔",
        gpt: "آپ کیا چاہتے ہیں کہ میں کروں؟"
    }
};

const getLang = (): Language => {
    const lang = CONFIG.LANGUAGE || 'zulu';  
    return languages[lang] || languages['zulu'];  
};

export default  { getLang };
