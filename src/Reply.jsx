import React, { useState } from "react";

function Reply(props) {
    let { commentId, commentDate, replies, name, comment, findItemByCommentId, commentsArr, deleteCommentOrReply } = props
    const [subReplyToggle, setSubReplyToggle] = useState(false)
    const [subReplyCommentId, setSubReplyCommentId] = useState('')
    const [subReplyName, setSubReplyName] = useState('')
    const [subReplyComment, setSubReplyComment] = useState('')

    const handelSubReplyEdit = (commentID, name, comment) => {
        setSubReplyToggle(true)
        setSubReplyCommentId(commentID)
        setSubReplyName(name)
        setSubReplyComment(comment)
    }
    const handleSubReplyPost = (e, parentId) => {
        const parentItem = findItemByCommentId(parentId, commentsArr);
        parentItem.name = subReplyName
        parentItem.comment = subReplyComment
        localStorage.setItem('commentsArr', JSON.stringify(commentsArr));
    }
    return (
        <>
            <div className="comment">
                <strong>{name}</strong>
                <div className="comment_date">
                    <span>{commentDate}</span>
                </div>
                <div className="container">

                    <span className="delete-icon" onClick={() => deleteCommentOrReply(commentId)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <circle cx="12" cy="12" r="11" fill="black" />
                        <path d="M12 6c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1zm-2 10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v9zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v9zm2-12H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1z" fill="white" />
                    </svg></span>
                </div>

                <p>{comment}</p>
                <div className="reply_edit">
                    <span onClick={() => handelSubReplyEdit(commentId, name, comment)}>Edit</span>
                </div>
            </div>
            {
                (subReplyToggle && commentId == subReplyCommentId) && <div id="comments-section" style={{ marginLeft: '20px' }}><form id="comment-form" onSubmit={(e) => handleSubReplyPost(e, commentId)}>
                    <label htmlFor="name">Name:</label><br />
                    <input type="text" id="name" placeholder="name" name="reply_name" value={subReplyName} onChange={(e) => setSubReplyName(e.target.value)} required /><br />
                    <label htmlFor="comment">Comment:</label><br />
                    <textarea id="comment" placeholder="comment" name="reply_comment" value={subReplyComment} onChange={(e) => setSubReplyComment(e.target.value)} required></textarea><br />
                    <button type="submit">Post</button>
                </form></div>

            }
            <div style={{ marginLeft: '20px' }}>
                {replies.map((reply) => (
                    <Reply key={reply.commentId} commentId={reply.commentId} replies={reply.replies} name={reply.name} comment={reply.comment} findItemByCommentId={findItemByCommentId} commentsArr={commentsArr} deleteCommentOrReply={deleteCommentOrReply} commentDate={commentDate} />
                ))}
            </div>
        </>
    )
}


export default Reply