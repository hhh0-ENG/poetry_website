
数据库连接：修改poetry-website\src\main\resources中的application.properties文件中的mysql.url为本地mysql的地址,主要是修改密码

win+R打开终端，输入命令
mysql -u root -p
接着输入密码


如果数据库已经有数据，则先删除数据库，再重新导入（一条一条执行，一个分号为一条命令）

1、-- 先关闭外键检查
SET FOREIGN_KEY_CHECKS = 0;

2、-- 删除所有表
DROP TABLE IF EXISTS daily_poetry, poetry, category, user_favorite, comment, user;

3、-- 重新开启外键检查
SET FOREIGN_KEY_CHECKS = 1;

4、-- 删除并重建数据库
DROP DATABASE IF EXISTS poetry_website;

CREATE DATABASE poetry_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

5、-- 重新导入
USE poetry_website;

SET NAMES utf8mb4;
SOURCE D:/IdeaProjects/poetry-website/src/main/resources/schema.sql;（将D:/IdeaProjects替换为自己的路径）
SOURCE D:/IdeaProjects/poetry-website/src/main/resources/init_data.sql;





# 学习社区功能设计方案

## 1. 功能概述

学习社区用于用户发布学习笔记、浏览他人笔记、互动（点赞、评论、回复）。

---

## 2. 数据库设计

### 2.1 新增表

#### post_like - 帖子点赞表

```sql
CREATE TABLE IF NOT EXISTS `post_like` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `post_id` INT NOT NULL,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
    INDEX idx_post_id (`post_id`),
    CONSTRAINT `fk_post_like_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_post_like_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子点赞';
```

### 2.2 现有表说明

| 表名 | 说明 | 复用情况 |
|------|------|---------|
| post | 帖子表 | 已有 title, content, view_count, like_count, comment_count |
| comment | 评论表 | 已有 parent_id 支持回复 |
| user | 用户表 | 已有 nickname, avatar |

---

## 3. 后端设计

### 3.1 新增代码文件

| 文件路径 | 说明 |
|---------|------|
| `src/main/java/com/poetry/entity/PostLike.java` | 帖子点赞实体类 |
| `src/main/java/com/poetry/mapper/PostLikeMapper.java` | 帖子点赞 Mapper |
| `src/main/java/com/poetry/service/PostLikeService.java` | 帖子点赞 Service |
| `src/main/java/com/poetry/controller/PostLikeController.java` | 帖子点赞 Controller |
| `src/main/java/com/poetry/entity/Comment.java` | 评论实体类 |
| `src/main/java/com/poetry/mapper/CommentMapper.java` | 评论 Mapper |
| `src/main/java/com/poetry/service/CommentService.java` | 评论 Service |
| `src/main/java/com/poetry/controller/CommentController.java` | 评论 Controller |

### 3.2 新增接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/post-like/my/add` | POST | 点赞帖子 |
| `/post-like/my/remove` | DELETE | 取消点赞 |
| `/post-like/my/check/{postId}` | GET | 检查是否已点赞 |
| `/post-like/count/{postId}` | GET | 获取点赞数 |

### 3.3 复用现有接口

| 接口 | 说明 |
|------|------|
| `/post/list` | 获取帖子列表 |
| `/post/{id}` | 获取帖子详情 |
| `/post/add` | 发布帖子 |
| `/post/view/{id}` | 增加浏览数 |
| `/comment/list` | 获取评论列表 |
| `/comment/add` | 添加评论 |

---

## 4. 前端设计

### 4.1 新增页面文件

| 文件路径 | 说明 |
|---------|------|
| `frontend/src/views/Community.vue` | 学习社区首页（笔记列表） |
| `frontend/src/views/PostPublish.vue` | 笔记发布页面 |
| `frontend/src/views/PostDetail.vue` | 笔记详情页 |

### 4.2 复用现有组件

| 组件 | 说明 |
|------|------|
| `frontend/src/components/Header.vue` | 顶部导航 |
| `frontend/src/components/Footer.vue` | 底部栏 |

### 4.3 复用现有 API

| API | 说明 |
|-----|------|
| `postApi.getPostList` | 获取帖子列表 |
| `postApi.getPostById` | 获取帖子详情 |
| `postApi.addPost` | 发布帖子 |
| `postApi.incrementViewCount` | 增加浏览数 |
| `commentApi.getCommentList` | 获取评论列表 |
| `commentApi.addComment` | 添加评论/回复 |

### 4.4 新增 API

| API | 说明 |
|-----|------|
| `postLikeApi.addMyLike` | 点赞帖子 |
| `postLikeApi.removeMyLike` | 取消点赞 |
| `postLikeApi.isMyLiked` | 检查是否已点赞 |
| `postLikeApi.getLikeCount` | 获取点赞数 |

---

## 5. 页面流程

### 5.1 学习社区首页

1. 用户点击"学习社区"导航
2. 跳转到 `/community` 页面
3. 显示笔记列表（按创建时间倒序）
4. 点击"发布笔记"按钮，跳转到发布页面

### 5.2 笔记发布页

1. 用户填写标题、想法（可选）
2. 点击"发布"按钮
3. 调用 `/post/add` 保存帖子
4. 自动跳转到社区首页，显示最新发布的笔记

### 5.3 笔记详情页

1. 用户点击笔记卡片
2. 跳转到 `/post/:id` 页面
3. 显示：发布者信息、标题、想法、浏览数、点赞数、评论数
4. 点击"点赞"按钮，调用 `/post-like/my/add`
5. 下方显示评论区，可评论和回复

---

## 6. 修改记录

| 日期 | 修改内容 |
|------|---------|
| 2026-03-27 | 初始化文档 |
| 2026-03-27 | 创建后端 PostLike 实体类、Mapper、Service、Controller |
| 2026-03-27 | 创建前端 postLikeApi、commentApi |
| 2026-03-27 | 重写 Community.vue 学习社区首页 |
| 2026-03-27 | 创建 PostPublish.vue 发布笔记页面 |
| 2026-03-27 | 重写 PostDetail.vue 笔记详情页（含点赞、评论、回复） |
| 2026-03-27 | 添加路由 /community/publish |
| 2026-03-27 | 更新 schema.sql 添加 post_like 表 |
| 2026-03-29 | 修复 PostService.java 默认 status 为 1（发布即审核通过） |
| 2026-03-29 | 修复 Community.vue 添加 onActivated 钩子自动刷新列表 |
| 2026-03-29 | 创建后端 Comment 实体类、Mapper、Service、Controller（评论功能） |
| 2026-03-29 | 修复 CommentMapper 字段别名 createTime |
| 2026-03-29 | 修复 PostMapper 字段别名（nickname, avatar, createTime 等） |
| 2026-03-29 | 修改帖子详情接口返回用户昵称信息 |
| 2026-03-29 | 修改评论数为评论+回复的总数 |
| 2026-03-29 | 修复点赞时同步更新帖子 likeCount |
