"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  DatePicker,
  InputNumber,
  Image,
} from "antd";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { UploadButton, UploadDropzone } from "@/app/utils/uploadthing";
import {
  callCreateMovie,
  callFetchMovieById,
  callUpdateMovie,
} from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import { useAppSelector } from "@/app/redux/hook";
import moment from "moment";
import { useRouter } from "next/navigation";

interface IProps {
  movieId?: number;
}

export const Movie = ({ movieId }: IProps) => {
  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<string>("");
  // const singleMovie = useAppSelector((state) => state.movie.singleMovie);

  const router = useRouter();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const validateMessages = {
    required: "${label} bắt buộc phải nhập!",
  };

  useEffect(() => {
    if (movieId != undefined) {
      const movieData = async () => {
        const res = await callFetchMovieById(movieId);
        setImgUrl(res?.data.img);
        form.setFieldsValue({
          name: res?.data.name,
          _cast: res?.data._cast,
          director: res?.data.director,
          time: res?.data.time, 
          genre: res?.data.genre,
          videoURL: res?.data.videoURL,
          description: res?.data.description,
          releaseDate: moment(res?.data.releaseDate),
        });
      };
      movieData();
    }
  }, []);


  const onFinish = async (values: IMovie) => {
    const {
      name,
      _cast,
      director,
      time,
      genre,
      videoURL,
      description,
      releaseDate,
    } = values;
    const movie = {
      img: imgUrl,
      name,
      _cast,
      director,
      time,
      genre,
      videoURL,
      description,
      releaseDate,
    };

    if (movieId != undefined) {
      const res = await callUpdateMovie(movieId, movie);
      if (res.data.error) {
        message.error("Không thể cập nhật!");
      } else {
        message.success("Update movie success.");
        // setImgUrl("");
        router.push("/admin/movie/all");
      }
    } else {
      const res = await callCreateMovie(movie);
      if (res.data.error) {
        message.error("Thêm thất bại!");

      } else {
        message.success("Thêm thành công.");
        setImgUrl("");
        form.resetFields();
      }
    }
  };

  return (
    <Access permission={ALL_PERMISSIONS.MOVIES.CREATE}>
      <div className="m-5 bg-white flex justify-center ">
        {/* <div className="text-xl font-bold mb-10 ">Thêm bộ phim mới
        </div> */}

        <Form
          title="Thêm bộ phim mới"
          {...layout}
          form={form}
          labelAlign="left"
          // name="nest-messages"
          onFinish={onFinish}
          style={{ width: "100%", margin: "60px", padding: "20px" }}
          validateMessages={validateMessages}
          className="text-2xl font-medium mb-10"
        >
          <div className="text-2xl mb-10 flex justify-start">
            {movieId != undefined
              ? "CÂP NHẬT TÔNG TIN PHIM"
              : "THÊM BỘ PHIM MỚI"}
          </div>
          <Form.Item name="img" label="Ảnh">
            <div className="flex">
              <div className="mr-5">
                <Image width={200} src={imgUrl} preview={false} />
              </div>
              <div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res: any) => {
                    setImgUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    message.error(error.message);
                  }}
                />
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="videoURL"
            label="Video trailer"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="genre" label="Thể loại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Miêu tả"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời lượng"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              addonBefore="+"
              addonAfter="phút"
              defaultValue={0}
            />
          </Form.Item>

          <Form.Item
            name="director"
            label="Đạo diễn"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="_cast"
            label="Diễn viên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Ngày khởi chiếu"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              style={{ height: 40, width: "100%" }}
              type="primary"
              htmlType="submit"
            >
              {movieId != undefined
                ? "Cập nhật"
                : "Thêm "}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Access>
  );
};
