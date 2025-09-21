
import 'dotenv/config';
import bcrypt from 'bcrypt';
import sequelize from '../database/db.js';

const { User, Category, Post, Comment, Mark } = sequelize.models;

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

async function main() {
  const saltRounds = Number(process.env.SALT || 10);

  // Users
  const usersCount = await User.count();
  if (usersCount < 5) {
    const password = await bcrypt.hash('password123', saltRounds);
    await User.bulkCreate([
      { login:'admin', email:'admin@example.com', password, role:'admin', fullName:'Admin' },
      { login:'alice', email:'alice@example.com', password, role:'user', fullName:'Alice' },
      { login:'bob', email:'bob@example.com', password, role:'user', fullName:'Bob' },
      { login:'carol', email:'carol@example.com', password, role:'user', fullName:'Carol' },
      { login:'dave', email:'dave@example.com', password, role:'user', fullName:'Dave' },
    ], { ignoreDuplicates: true });
  }

  // Categories
  const catTitles = ['JavaScript','Node.js','Databases','Algorithms','DevOps','Security'];
  const cats = [];
  for (const title of catTitles) {
    const [c] = await Category.findOrCreate({ where:{ title }, defaults:{ description:`About ${title}` } });
    cats.push(c);
  }

  // Posts
  const users = await User.findAll();
  const postsCount = await Post.count();
  if (postsCount < 5) {
    for (let i=0;i<6;i++) {
      const u = rand(users);
      const p = await Post.create({
        title: `Sample Post ${i+1}`,
        content: `This is demo content for post #${i+1}.`,
        authorId: u.id,
        status: i%5===0 ? 'inactive' : 'active',
        locked: i%6===0 ? true : false,
      });
      // attach 1-2 categories if model supports through table (associations are set in db.js)
      if (p.addCategory) {
        await p.addCategory(rand(cats));
        await p.addCategory(rand(cats));
      }
    }
  }

  // Comments
  const posts = await Post.findAll();
  const commentsCount = await Comment.count();
  if (commentsCount < 5 && posts.length) {
    for (let i=0;i<8;i++) {
      const u = rand(users);
      const p = rand(posts);
      await Comment.create({
        content: `Comment ${i+1} on post ${p.id}`,
        authorId: u.id,
        postId: p.id,
        status: i%7===0 ? 'inactive' : 'active'
      });
    }
  }

  // Marks (likes/dislikes)
  const comments = await Comment.findAll();
  const markPairs = [];
  for (const p of posts) {
    const u = rand(users);
    markPairs.push({ authorId: u.id, targetType:'post', targetId:p.id, type: Math.random()>0.2?'like':'dislike' });
  }
  for (const c of comments) {
    const u = rand(users);
    markPairs.push({ authorId: u.id, targetType:'comment', targetId:c.id, type: Math.random()>0.2?'like':'dislike' });
  }
  if (markPairs.length) await Mark.bulkCreate(markPairs, { ignoreDuplicates:true });

  console.log('Seed completed ✔');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
