
interface AdminStatCardProps {
  title: string;
  value: number;
  highlight?: boolean;
}

const AdminStatCard = ({ title, value, highlight = false }: AdminStatCardProps) => (
  <div className={`p-4 rounded-lg shadow ${highlight ? 'bg-red-50 border border-red-200' : 'bg-white'}`}>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

export default AdminStatCard;
