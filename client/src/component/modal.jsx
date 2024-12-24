import { Modal, Input, Checkbox, Form } from "antd";

const CustomModal = ({ isOpen, onClose, onSubmit, isCreate }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (!isCreate) {
            values.completed = values.completed ? 1 : 0;
        } else {
        values.completed = 0; 
        }
        onSubmit(values);
        form.resetFields();
        onClose();
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={isCreate ? "Thêm Todo" : "Cập nhật Todo"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả" rows={4} />
        </Form.Item>
        {!isCreate && (
          <Form.Item
            name="completed"
            valuePropName="checked"
          >
            <Checkbox>Hoàn thành</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CustomModal;
