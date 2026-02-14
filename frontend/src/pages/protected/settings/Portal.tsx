import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/util/request";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, ImageDown, Upload } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmNewPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function Portal() {
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get("/companydetail/logo");
        if (response.data.logo) {
          setLogo(response.data.logo);
        }
      } catch (error) {
        console.log("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    try {
      await axios.post("/auth/change-password", data);
      passwordForm.reset();
    } catch (error) {
      console.log("Error changing password:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPEG, JPG, PNG, and GIF images are allowed");
      e.target.value = "";
      return;
    }

    // Validate file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      setFileError("Image size cannot exceed 1 MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleLogoUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("logo", selectedFile);

    setUploading(true);
    try {
      const response = await axios.post("/companydetail/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLogo(response.data.logo + "?t=" + Date.now());
      setSelectedFile(null);
    } catch (error) {
      console.log("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoRemove = async () => {
    setRemoving(true);
    try {
      await axios.delete("/companydetail/logo");
      setLogo(null);
    } catch (error) {
      console.log("Error removing logo:", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Portal Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-2"
          >
            <Controller
              name="currentPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="currentPassword">
                    Current Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      aria-invalid={fieldState.invalid}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      aria-invalid={fieldState.invalid}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmNewPassword">
                    Confirm New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      aria-invalid={fieldState.invalid}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button
              className="min-w-32"
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logo Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              accept=".jpeg,.jpg,.png,.gif"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {fileError && <p className="text-sm text-red-500">{fileError}</p>}
          </div>
          {logo && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={`${axios.defaults.baseURL?.split("/api")[0]}${logo}`}
                alt="Company Logo"
                className="max-w-1/4 max-h-1/4 object-contain"
                key={logo}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleLogoUpload}
            disabled={!selectedFile || uploading}
            className="min-w-32 mr-2"
          >
            <Upload/>
            {uploading ? <Spinner data-icon="inline-start" /> : "Upload Logo"}
          </Button>
          {logo && (
            <Button
              variant="destructive"
              onClick={handleLogoRemove}
              disabled={removing}
              className="min-w-32"
            >
              <ImageDown/>
              {removing ? <Spinner data-icon="inline-start" /> : "Remove Logo"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
