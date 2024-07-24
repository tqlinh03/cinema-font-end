"use client";
import { callFetchMovie } from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import { Button, Card, Col, Divider, Grid, Row, message } from "antd";
import Meta from "antd/es/card/Meta";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { useBreakpoint } = Grid;

export const MovieCard = () => {
  const [displayMovie, setDisplayMovie] = useState<IMovie[] | null>(null);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const screens = useBreakpoint();

  useEffect(() => {
    fetchMovie();
  }, []);

  console.log(displayMovie);
  const fetchMovie = async () => {
    setIsLoading(true);
    const query = `page=0&size=100`;
    const res = await callFetchMovie(query);
    if (res.data) {
      setDisplayMovie(res.data.content);
      setIsLoading(false);
    } else {
      message.error("Can not call api fetchMovie!");
    }
  };
  const handleDetailMovie = (id: number) => {
    router.push(`/movie/${id}`);
  };

  return (
    <>
      <div className="mt-14">
        {/* <Divider orientation="center"></Divider> */}

        <Row justify={"start"} gutter={[40, 40]}>
          {displayMovie?.map((item) => {
            return (
              <Col
                style={{
                  width: 255,
                  display: "flex",
                  justifyContent: "center",
                }}
                span={screens.sm ? 12 : 24}
                md={screens.xl ? 6 : screens.md ? 8 : screens.sm ? 12 : 24}
                key={item.id}
              >
                <Card
                  bodyStyle={{ padding: 0 }}
                  bordered={false}
                  style={{
                    width: screens.lg
                      ? 250
                      : screens.md
                      ? 200
                      : screens.sm
                      ? 250
                      : 250,
                    borderRadius: "20px",
                    boxShadow: "none",
                  }}
                  cover={
                    <img
                      style={{
                        objectFit: "cover",
                        borderRadius: "20px",
                        height: screens.xl
                          ? 360
                          : screens.lg
                          ? 370
                          : screens.md
                          ? 300
                          : 360,
                      }}
                      alt="example"
                      src={item.img}
                    />
                  }
                  actions={[
                    <Button
                      style={{
                        backgroundColor: "#2085C7",
                        color: "#fff",
                        border: "none",
                        width: screens.lg ? 250 : screens.md ? 200 : 250,
                        height: 35,
                      }}
                      onClick={() => handleDetailMovie(item.id)} 
                    >
                      MUA VÉ
                    </Button>,
                  ]}
                >
                  <Meta
                    style={{ padding: 0, marginTop: 2 }}
                    title={
                      <div
                        className="text-[#4184b0] text-lg hover:underline hover:cursor-pointer"
                        onClick={() => handleDetailMovie(item.id)}
                      >
                        {item.name}
                      </div>
                    }
                    description={
                      <div className="mb-5 text-gray-600">
                        <div>
                          <span className="font-bold">Thể loại: </span>
                          <span>{item.genre}</span>
                        </div>
                        <div>
                          <span className="font-bold">Thời lượng: </span>
                          <span>{item.time} phút</span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};
