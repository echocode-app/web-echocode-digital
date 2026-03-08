import { useFormStatus } from 'react-dom';

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  //   console.log(status);

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full py-2.5 px-6 font-title bg-main-gradient rounded-base text-[10px] cursor-pointer"
    >
      {pending ? 'Pending' : 'Apply For this poition'}
    </button>
  );
};

export default SubmitBtn;
