"use client";
import { List } from "antd";
import React from "react";
import { RenderComment } from "./comment.render";
import { ICommentProps } from "@/app/types/backend";

export const CommentList = ({ comments }: { comments: ICommentProps[] }) => {

  return (
    <>
      <List
        dataSource={comments}
        header={`${comments.length} ${
          comments.length > 1 ? "replies" : "reply"
        }`}
        itemLayout="horizontal"
        renderItem={(comment) => 
          <RenderComment
            comment={comment} 
            movieId={comment.movie._id}
          />}
      />
    </>
  );
};
