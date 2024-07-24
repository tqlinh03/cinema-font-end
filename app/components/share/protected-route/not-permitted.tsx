import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

const NotPermitted = () => {
    const router = useRouter();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi bạn không có quyền truy cập thông tin này."
            extra={<Button type="primary"
                onClick={() => router.push('/')}
            >Back Home</Button>}
        />
    )
};

export default NotPermitted;