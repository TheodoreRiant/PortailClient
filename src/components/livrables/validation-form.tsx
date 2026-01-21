"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const validationSchema = z.object({
  statut: z.enum(["Approuvé", "Refusé", "À modifier"]),
  commentaire: z.string().optional(),
  urgence: z.enum(["Mineur", "Moyen", "Important", "Bloquant"]).optional(),
  noteSatisfaction: z.number().min(1).max(5).optional(),
});

type ValidationFormData = z.infer<typeof validationSchema>;

interface ValidationFormProps {
  deliverableId: string;
  projectId: string;
  onSuccess?: () => void;
  className?: string;
}

export function ValidationForm({
  deliverableId,
  projectId,
  onSuccess,
  className,
}: ValidationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      statut: undefined,
      commentaire: "",
    },
  });

  const selectedStatus = watch("statut");

  const onSubmit = async (data: ValidationFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/livrables/${deliverableId}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          projectId,
          noteSatisfaction: rating > 0 ? rating : undefined,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Une erreur est survenue");
      }

      toast.success(
        data.statut === "Approuvé"
          ? "Livrable validé avec succès"
          : data.statut === "Refusé"
          ? "Livrable refusé"
          : "Demande de modification envoyée"
      );

      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la validation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      {/* Status selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Votre décision</Label>
        <RadioGroup
          value={selectedStatus}
          onValueChange={(value) =>
            setValue("statut", value as ValidationFormData["statut"])
          }
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <label
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
              selectedStatus === "Approuvé"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <RadioGroupItem value="Approuvé" className="sr-only" />
            <div
              className={cn(
                "p-2 rounded-lg",
                selectedStatus === "Approuvé"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Valider</p>
              <p className="text-xs text-gray-500">Approuver ce livrable</p>
            </div>
          </label>

          <label
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
              selectedStatus === "À modifier"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <RadioGroupItem value="À modifier" className="sr-only" />
            <div
              className={cn(
                "p-2 rounded-lg",
                selectedStatus === "À modifier"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Modifier</p>
              <p className="text-xs text-gray-500">Demander des ajustements</p>
            </div>
          </label>

          <label
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
              selectedStatus === "Refusé"
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <RadioGroupItem value="Refusé" className="sr-only" />
            <div
              className={cn(
                "p-2 rounded-lg",
                selectedStatus === "Refusé"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Refuser</p>
              <p className="text-xs text-gray-500">Ne convient pas</p>
            </div>
          </label>
        </RadioGroup>
        {errors.statut && (
          <p className="text-sm text-red-500">Veuillez sélectionner une option</p>
        )}
      </div>

      {/* Comment - shown for reject or modify */}
      {(selectedStatus === "Refusé" || selectedStatus === "À modifier") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="commentaire" className="text-base font-medium">
              Que souhaitez-vous modifier ?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="commentaire"
              placeholder="Décrivez précisément les modifications souhaitées..."
              className="min-h-[120px]"
              {...register("commentaire", {
                required:
                  selectedStatus === "Refusé" || selectedStatus === "À modifier",
              })}
            />
            {errors.commentaire && (
              <p className="text-sm text-red-500">Ce champ est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgence" className="text-base font-medium">
              Degré d&apos;urgence
            </Label>
            <Select onValueChange={(value) => setValue("urgence", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'urgence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mineur">Mineur - Détail à corriger</SelectItem>
                <SelectItem value="Moyen">Moyen - Modification nécessaire</SelectItem>
                <SelectItem value="Important">Important - Changement significatif</SelectItem>
                <SelectItem value="Bloquant">Bloquant - Ne peut être accepté en l&apos;état</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Optional comment for approval */}
      {selectedStatus === "Approuvé" && (
        <div className="space-y-2">
          <Label htmlFor="commentaire" className="text-base font-medium">
            Commentaire (optionnel)
          </Label>
          <Textarea
            id="commentaire"
            placeholder="Ajoutez un commentaire si vous le souhaitez..."
            className="min-h-[80px]"
            {...register("commentaire")}
          />
        </div>
      )}

      {/* Satisfaction rating */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Notez votre satisfaction (optionnel)
        </Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={cn(
                  "w-7 h-7 transition-colors",
                  (hoverRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <button
              type="button"
              className="ml-2 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setRating(0)}
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isLoading || !selectedStatus}
          className={cn(
            "min-w-[150px]",
            selectedStatus === "Approuvé" && "bg-green-600 hover:bg-green-700",
            selectedStatus === "Refusé" && "bg-red-600 hover:bg-red-700",
            selectedStatus === "À modifier" && "bg-orange-600 hover:bg-orange-700"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              {selectedStatus === "Approuvé" && (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Valider le livrable
                </>
              )}
              {selectedStatus === "Refusé" && (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser le livrable
                </>
              )}
              {selectedStatus === "À modifier" && (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Demander des modifications
                </>
              )}
              {!selectedStatus && "Sélectionnez une option"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default ValidationForm;
