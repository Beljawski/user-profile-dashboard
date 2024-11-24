import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import s from "./index.module.css";
import shared from "../../shared.module.css";
import Placeholder from "../../assets/images/avatar_placeholder.svg";

function AvatarUpload() {
  const [imageSrc, setImageSrc] = useState(null); // Originalbild
  const [croppedImage, setCroppedImage] = useState(null); // Gespeichertes zugeschnittenes Bild
  const [croppedArea, setCroppedArea] = useState(null); // Beschnittener Bereich
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Zuschneide-Position
  const [zoom, setZoom] = useState(1); // Zoom-Level
  const [isCropping, setIsCropping] = useState(false); // Zuschneide-Modus
  const [isEditMode, setIsEditMode] = useState(true); // Bearbeitungsmodus (Edit/Save)

  // Beim Laden des Components Avatar aus localStorage laden
  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) {
      setImageSrc(storedAvatar);
      setCroppedImage(storedAvatar); // Avatar für Vorschau setzen
    }
  }, []);

  // Bild hochladen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Zuschneidebereich aktualisieren
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  // Bildzuschnitt abschließen und speichern
  const handleCropDone = () => {
    setIsCropping(false);

    // Beschnittener Bereich mit Canvas speichern
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const { width, height } = croppedArea;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(
        img,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        width,
        height
      );
      canvas.toBlob((blob) => {
        const croppedImageUrl = URL.createObjectURL(blob);
        setCroppedImage(croppedImageUrl); // Speichere das zugeschnittene Bild

        // Speichern des Avatars im localStorage
        localStorage.setItem("avatar", croppedImageUrl); // Avatar speichern
      });
    };
  };

  // Profilbild löschen
  const handleDeleteImage = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setIsCropping(false);

    // Löschen des Avatars aus localStorage
    localStorage.removeItem("avatar");
  };

  return (
    <div className={shared.avatar_container}>
      {/* Edit-Modus */}
      {isEditMode ? (
        <>
          {/* Zuschneide-Modus */}
          {isCropping ? (
            <div className={s.cropper_container}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // Quadratverhältnis für den Avatar
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <button className={shared.button} onClick={handleCropDone}>
                Save Crop
              </button>
            </div>
          ) : (
            <>
              <div className={s.preview_container}>
                {croppedImage ? (
                  <img src={croppedImage} alt="Cropped avatar" className={s.img_preview} />
                ) : imageSrc ? (
                  <img src={imageSrc} alt="Uploaded avatar" className={s.img_preview} />
                ) : (
                  <img src={Placeholder} alt="Avatar placeholder" className={s.img_placeholder} />
                )}
              </div>

              {/* Buttons abhängig vom Bildzustand */}
              {!imageSrc ? (
                <>
                  <label htmlFor="file-upload" className={shared.button}>
                    Avatar Upload
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className={s.file_input_hidden}
                  />
                </>
              ) : croppedImage ? (
                <>
                  <button className={shared.button} onClick={() => setIsCropping(true)}>
                    Change Avatar
                  </button>
                  <button className={shared.button} onClick={handleDeleteImage}>
                    Delete Avatar
                  </button>
                </>
              ) : (
                <button className={shared.button} onClick={() => setIsCropping(true)}>
                  Crop Image
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <div className={s.preview_container}>
          {croppedImage ? (
            <img src={croppedImage} alt="Saved avatar" className={s.img_preview} />
          ) : (
            <img src={Placeholder} alt="Avatar placeholder" className={s.img_placeholder} />
          )}
        </div>
      )}

      {/* Umschalten zwischen Bearbeitungsmodus und Profilansicht */}
      <button
        className={shared.button}
        onClick={() => setIsEditMode((prev) => !prev)}
      >
        {isEditMode ? "Save Profile" : "Edit Profile"}
      </button>
    </div>
  );
}

export default AvatarUpload;

