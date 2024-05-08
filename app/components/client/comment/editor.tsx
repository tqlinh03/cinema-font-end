"use client";
import { useAppSelector } from "@/app/redux/hook";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import React from "react";

const { TextArea } = Input;

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (commentId?: number, movieId?: never) => void
  submitting: boolean;
  value: string;
}

  

export const Editor = ({
  onChange,
  onSubmit,
  submitting,
  value,
}: EditorProps) => {
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated)

  return (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={() => onSubmit()}
          type="primary"
        >
          {isAuthenticated === true ? 
            "Add Comment" 
          : 
            <Link href={'/login'}> login to comment</Link>}
        </Button>
      </Form.Item>
    </>
  );
};
