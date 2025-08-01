import {prisma} from "./client"
import bcrypt from "bcrypt"

async function password(pass:any) {
        return await bcrypt.hash(pass, 10)
    }

async function main() {

    await prisma.users.deleteMany()
    await prisma.threads.deleteMany()
    await prisma.following.deleteMany()
    await prisma.likes.deleteMany()
    await prisma.replies.deleteMany()

    const user1=   await prisma.users.create({
        data: { username:"Galang",full_name:"Galang Anggara", email:"galang@gmail.com", password: await password("123456"), bio:"aku suka makan"}, 
    })

    const user2=   await prisma.users.create({
      data: { username:"Sinta",full_name:"Sinta Arinda", email:"sinta@gmail.com", password: await password("123456"), bio:"aku suka makan"}
    })

    const user3=   await prisma.users.create({
      data: { username:"Priska",full_name:"Priska Utami", email:"priska@gmail.com", password: await password("123456"), bio:"aku suka makan"}
    })

    const user4=   await prisma.users.create({
      data: { username:"Budi",full_name:"Budi Anggara", email:"budi@gmail.com", password: await password("123456"), bio:"aku suka makan"}
    })

    const user5 =   await prisma.users.create({
      data: { username:"jhon",full_name:"Jhon Steve", email:"jhon@gmail.com", password: await password("123456"), bio:"aku suka makan"}
     })
    
     await prisma.following.createMany({
        data: [
            {follower_id:user1.id, following_id: user2.id},
            {follower_id:user2.id, following_id: user1.id},
            {follower_id:user1.id, following_id: user3.id},
            {follower_id:user3.id, following_id: user5.id},
            {follower_id:user5.id, following_id: user2.id},
            {follower_id:user4.id, following_id: user1.id},
            {follower_id:user5.id, following_id: user4.id},
        ]
     })

     const threads1 = await prisma.threads.create({
        data : {content:"lagi bingung nih sumpah", number_of_replies:1, created_by: user1.id}
     })
     const threads2 = await prisma.threads.create({
        data : {content:"enaknya ngapain ya", number_of_replies:0, created_by: user2.id}
     })
     const threads3 = await prisma.threads.create({
        data : {content:"bingung banget mau ngapain", number_of_replies:0, created_by: user3.id}
     })
     const threads4 = await prisma.threads.create({
        data : {content:"bingungggggggg........", number_of_replies:0, created_by: user4.id}
     })
     const threads5 = await prisma.threads.create({
        data : {content:"makan enak kali ya", number_of_replies:0, created_by: user5.id}
     })


     await prisma.likes.createMany({
        data:[
            {user_id: user2.id, thread_id: threads1.id, created_by: user1.id},
            {user_id: user2.id, thread_id: threads2.id, created_by: user2.id},
            {user_id: user2.id, thread_id: threads3.id, created_by: user3.id},
            {user_id: user2.id, thread_id: threads4.id, created_by: user4.id},
            {user_id: user2.id, thread_id: threads5.id, created_by: user5.id}
        ]
     })
}

main()