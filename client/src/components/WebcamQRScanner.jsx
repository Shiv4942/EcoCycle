import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const WebcamQRScanner = ({ onScan, scanning, loading }) => {
  const webcamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    if (!scanning || loading) return;

    scanIntervalRef.current = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      const img = new window.Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height);
        if (code) {
          onScan({ text: code.data });
        }
      };
    }, 1000);

    return () => clearInterval(scanIntervalRef.current);
  }, [scanning, loading, onScan]);

  return (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/png"
      width={350}
      height={350}
      videoConstraints={{ facingMode: 'environment' }}
    />
  );
};

export default WebcamQRScanner; 