"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import {  UploadDropzone } from "@/app/utils/uploadthing";
import { callCreateMovie, callUpdateMovie } from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import { useAppSelector } from "@/app/redux/hook";
import moment from "moment";
import { useRouter } from "next/navigation";

interface IProps {
  movieId?: number
}
export const Movie = (movieId: IProps) => {
  const [form] = Form.useForm();
  const [ imgUrl, setImgUrl ] = useState<string>("")
  const router = useRouter()
  const singleMovie = useAppSelector((state) => state.movie.singleMovie);


  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  useEffect(() => {
    if(movieId.movieId == singleMovie._id) {
      form.setFieldsValue({
        name: singleMovie?.name, 
        cast: singleMovie?.cast, 
        director: singleMovie?.director, 
        time: singleMovie?.time,
        genre: singleMovie?.genre,  
        videoURL: singleMovie?.videoURL,  
        description: singleMovie?.description, 
        ReleaseDate: moment(singleMovie?.ReleaseDate) 
      })
    }
  }, []) 

  const onFinish = async (values: IMovie) => {
    const {name, cast,director, time, genre, videoURL, description, ReleaseDate} = values
    const movie = {img: imgUrl, name, cast, director, time, genre, videoURL,description, ReleaseDate}
    
    if(movieId.movieId == singleMovie._id) {
      const res = await callUpdateMovie(singleMovie._id, movie) 
      console.log(res)
      if(res.data) {
        message.success("Update movie success.")
        setImgUrl('')
        router.push('/admin/movie/all')
      } else {
        message.error("Can not Update movie!")
      }
    } else {
      const res = await callCreateMovie(movie) 
      console.log(res)

      if(res.data) {
        message.success("Create movie success.")
        setImgUrl('')
      } else {
        message.error("Can not create movie!")
      }
    }

  };

  return (
    <Access permission={ALL_PERMISSIONS.MOVIES.GET_PAGINATE}>
      <div className="p-10 bg-white ">
        <div className="text-xl font-bold mb-10 ">Movie Infomation</div>
        <Form
          title="Movie Infomation"
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="img"
            label="Cover image"
            // rules={[{ required: true }]}
          >
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={async (res: any) => {
                  await setImgUrl(res[0].url)
                }}
                onUploadError={(error: Error) => {
                  message.error(error.message)
                }}
                appearance={{
                  uploadIcon: {
                    height: 50
                  }
                }}
              />
          </Form.Item>

          <Form.Item
            name="videoURL"
            label="Video trailer"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <InputNumber
              min={1}
              addonBefore="+"
              addonAfter="minute"
              defaultValue={0}
            />
          </Form.Item>

          <Form.Item
            name="director"
            label="Director"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="cast" label="Cast" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="ReleaseDate"
            label="ReleaseDate"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="description"
            label="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {movieId.movieId == singleMovie._id ? "Update": "Create"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Access>
  );
};
