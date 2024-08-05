import { H3Event } from 'h3';
export async function getPosts(event: H3Event) {
    return {
        posts: [
            {
                title: 'Hello World',
                content: 'This is a test post'
            }
        ]
    }   
}