import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const DailyTips = () => {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">💡</span>
          </div>
          <span>Daily Skin Care Tip</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-700 leading-relaxed">
          Apply sunscreen with at least SPF 30 daily, even on cloudy days. UV
          rays can penetrate clouds and cause skin damage that may lead to
          premature aging and skin cancer.
        </p>
      </CardContent>
    </Card>
  );
};
export default DailyTips;
