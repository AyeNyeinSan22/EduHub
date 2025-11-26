import { useEffect, useMemo } from "react";

export default function FileInput({ label, name, valueFile, onChange, accept }) {
    const preview = useMemo(() => {
        if (!valueFile) {
            return null;
        }

        // If it's an image → create object URL for preview
        if (valueFile.type.startsWith("image/")) {
            return URL.createObjectURL(valueFile);
        }

        // If it's pdf/doc → no preview
        return null;
    }, [valueFile]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <div>
            <label className="block mb-1 font-medium">{label}</label>

            <input
                type="file"
                name={name}
                accept={accept}
                onChange={(e) => onChange(e.target.files[0])}
                className="border p-2 rounded w-full"
            />

            {preview && (
                <img
                    src={preview}
                    className="w-28 h-28 mt-2 object-cover rounded border"
                    alt="preview"
                />
            )}
        </div>
    );
}
