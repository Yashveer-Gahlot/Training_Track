"use client";

import useHistory from "@/hooks/useHistory";
import Loader from "@/components/Loader";
import History from "@/components/History";
import ProgressChart from "@/components/ProgressChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Trash } from "lucide-react";

const Statistics = () => {
  const { history, isLoading, deleteTraining, clearHistory } = useHistory();

  if (isLoading) {
    return <Loader />;
  }

  const onClearHistory = () => {
    if (
      confirm(
        "Are you sure to clear the history? This action cannot be undone."
      )
    ) {
      clearHistory();
    }
  };

  const onExportJson = () => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.json";
    a.click();
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
       {history && history.length > 0 ? (
        <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Your Progress</CardTitle>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    disabled={!history || history.length === 0}
                    onClick={onExportJson}
                    className="cursor-pointer"
                  >
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" onClick={onClearHistory}>
                 <Trash className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
              <div className="w-full h-[350px] mb-6">
                <ProgressChart history={history} />
              </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Training History</CardTitle>
          </CardHeader>
          <CardContent>
            <History history={history} deleteTraining={deleteTraining} />
          </CardContent>
        </Card>
        </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-16 text-muted-foreground">
                <h3 className="text-xl font-semibold">No training history yet</h3>
                <p className="mt-2">Complete a session on the Training page to see your stats!</p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default Statistics;
