import { format } from "date-fns";
import { RegistrationRequest } from "../types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Eye, FlaskConical, User, XCircle } from "lucide-react";

type RequestsTableProps = {
  requests: RegistrationRequest[];
  onView: (request: RegistrationRequest) => void;
  onApprove: (id: string) => void;
  onOpenReject: (request: RegistrationRequest) => void;
  isApproving: boolean;
  isRejecting: boolean;
};

const RoleIcon = ({ role }: { role: "user" | "researcher" }) =>
  role === "researcher" ? (
    <FlaskConical className="h-4 w-4 text-blue-500" />
  ) : (
    <User className="h-4 w-4 text-gray-500" />
  );

export const RequestsTable = ({
  requests,
  onView,
  onApprove,
  onOpenReject,
  isApproving,
  isRejecting,
}: RequestsTableProps) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Submitted On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req._id}>
            <TableCell className="font-medium">
              <div>{req.fullName}</div>
              <div className="text-sm text-muted-foreground">{req.email}</div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <RoleIcon role={req.requestedRole} />
                <span className="capitalize">{req.requestedRole}</span>
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(req.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(req)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {req.status === "pending" && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onApprove(req._id)}
                      disabled={isApproving}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onOpenReject(req)}
                      disabled={isRejecting}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
