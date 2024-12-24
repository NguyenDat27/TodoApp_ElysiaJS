import { Progress } from 'antd';
import { useTodo } from '../store/todoStore';

const ProgressCircle = () => {
  const [percent] = useTodo.percent();

  return (
    <div className="container mx-auto pl-5 flex justify-center items-center mt-3">
      <Progress
        type="circle"
        percent={percent}
        width={100}
        strokeWidth={12}
        strokeColor="#1890ff"
        trailColor="#f5222d"
        format={(percent) => `${percent}%`}
      />
    </div>
  );
};

export default ProgressCircle;
