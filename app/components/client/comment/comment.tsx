"use client";
import { Avatar, message } from "antd";
import { Comment } from "@ant-design/compatible";
import React, { useContext, useEffect, useState } from "react";
import { Editor } from "./editor";
import { CommentList } from "./comment.list";
import { callCreateComment, callFetchCommentByMovieId } from "@/app/config/api";
import { useAppSelector } from "@/app/redux/hook";
import { WebsocketContext } from "@/app/contexts/WebsocketContext";
import { ICommentProps } from "@/app/types/backend";

export const CommentMovie = ({ movieId }: { movieId: number }) => {
  const [comments, setComments] = useState<ICommentProps[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const user = useAppSelector((state) => state.account.user);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    const fetchComment = async () => {
      const res = await callFetchCommentByMovieId(movieId);
      if (res.data) {
        setComments(res.data);
      } else {
        message.error("can not callFetchCommentByMovieId ");
      }
    };
    fetchComment();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected!");
    });
    socket.on("onMessage", (newMessage: ICommentProps[]) => {
      setComments(newMessage);
      setSubmitting(false);
    });
    return () => {
      socket.off("connect");
      socket.off("onMessage");
    };
  }, []);

  const handleSubmit = async () => {
    if (!value) return;

    setSubmitting(true);
    const comment = {
      movie: movieId,
      content: value,
      user: +user._id,
    };
    const res = await callCreateComment(comment);
    setTimeout(async () => {
      setValue("");
      if (res.data) {
        const res = await callFetchCommentByMovieId(movieId);
        socket.emit("newMessage", res.data);
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={<Avatar>{user?.name.substring(0, 1).toUpperCase()}</Avatar>}
        content={
          <Editor
            onChange={handleChange}
            onSubmit={() => handleSubmit()}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
};
