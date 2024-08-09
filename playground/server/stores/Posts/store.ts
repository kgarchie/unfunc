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

export async function postPosts(event: H3Event) {
    return {
        posts: [
            {
                title: 'Maya',
                content: 'This is a test post'
            }
        ]
    }   
}


export async function gunPosts(event: H3Event) {
    return {
        posts: [
            {
                title: 'Haha',
                content: 'This is a test post'
            }
        ]
    }   
}