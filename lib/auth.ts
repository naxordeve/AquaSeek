import axios from 'axios';
// auth_state
export async function getGoFileDownload(contentId: string): Promise<string | null> {
    try { const { data } = await axios.get(`https://api.gofile.io/contents/${contentId}`);
        if (data.status !== 'ok') {
           console.log(`${data.message}`);
         return null; }
        const db = data.data;
        const first = db.children.find((child: any) => child.type === 'file');
        if (first && first.link) {
            return first.link;
        } else {
            console.error('No_file_found');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
      }
                                       }

