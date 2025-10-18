import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface PromoBasicFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  image: string;
  setImage: (value: string) => void;
  terms: string;
  setTerms: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  isAvailable: boolean;
  setIsAvailable: (value: boolean) => void;
  errors?: Record<string, string>;
}

export default function PromoBasicForm({
  title, setTitle,
  description, setDescription,
  image, setImage,
  terms, setTerms,
  startDate, setStartDate,
  endDate, setEndDate,
  isAvailable, setIsAvailable,
  errors = {},
}: PromoBasicFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="title">Title Promo</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Diskon 50%"
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi promo..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          placeholder="Syarat dan ketentuan..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isAvailable"
          checked={isAvailable}
          onCheckedChange={(checked) => setIsAvailable(Boolean(checked))}
        />
        <Label htmlFor="isAvailable" className="cursor-pointer">
          Available
        </Label>
      </div>
    </div>
  );
}
