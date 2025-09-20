import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Introduction from "@/components/Introduction";

const IntroductionSection = () => {
  return (
    <div className="w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <Introduction />
        </CardContent>
      </Card>
    </div>
  );
};

export default IntroductionSection;
