export async function waitForComment({
  service,
  taskId,
  commentId,
  expectedText = null,
  shouldExist = true,
  interval = 200,
  timeout = 3000
}) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const response = await service.get_comments(taskId);
    const comment = response?.comments?.find(c => c.id == commentId);

    if (shouldExist) {
      if (comment) {
        if (expectedText === null || comment.comment_text === expectedText) {
          return comment;
        }
      }
    }

    if (!shouldExist && !comment) {
      return true;
    }

    await new Promise(res => setTimeout(res, interval));
  }

  throw new Error(
    `Timeout waiting for comment ${commentId} ` +
    (shouldExist
      ? expectedText
        ? `to update to "${expectedText}"`
        : `to exist`
      : `to be deleted`)
  );
}

export async function waitForReply({
  service,
  parentCommentId,
  replyId,
  expectedText = null,
  shouldExist = true,
  interval = 200,
  timeout = 3000
}) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const response = await service.get_comments_reply(parentCommentId);
      const reply = response?.comments?.find(c => c.id == replyId);

      if (shouldExist) {
        if (reply) {
          if (expectedText === null || reply.comment_text === expectedText) {
            return reply;
          }
        }
      } else {
        if (!reply) {
          return true;
        }
      }

      await new Promise(res => setTimeout(res, interval));
    } catch (error) {
      console.error('Error in waitForReply:', error.message);
    }
  }

  throw new Error(`Timeout waiting for reply ${replyId}`);
}

export async function waitForChatComment({
  service,
  viewId,
  commentId,
  shouldExist = true,
  interval = 200,
  timeout = 3000
}) {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      const response = await service.get_comments_chatView(viewId);
      const comment = response?.comments?.find(c => c.id == commentId);
      
      if (shouldExist && comment) return comment;
      if (!shouldExist && !comment) return true;
      
      await new Promise(res => setTimeout(res, interval));
    } catch (error) {
      console.error('Error in waitForChatComment:', error.message);
      await new Promise(res => setTimeout(res, interval));
    }
  }
  
  throw new Error(
    `Timeout waiting for chat comment ${commentId} ` +
    (shouldExist ? 'to exist' : 'to be deleted')
  );
}