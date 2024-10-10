import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card>
        <CardContent className="flex items-center space-x-4 p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          <CardTitle className="text-2xl">Uploading...</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
};
