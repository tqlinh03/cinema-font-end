"use client"
import { CSSProperties, useState } from 'react';
import OtpInput from 'react-otp-input';
import { text } from 'stream/consumers';
interface Props {
  otp: string;
  setOtp: (otp: string) => void;
}
export const ConfirmOTP = ({
  otp,
  setOtp
} : Props) => {
  // const [otp, setOtp] = useState('');

  const inputStyle: CSSProperties = {
    width: '50px',
    height: '50px',
    margin: '5px',
    fontSize: '30px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    textAlign: 'center',
  };

  return ( 
    <OtpInput 
    value={otp}
    onChange={setOtp}
    numInputs={6}
    renderSeparator={<span> - </span>}
    renderInput={(props) => <input {...props} style={inputStyle}  />}
  />
  );
}