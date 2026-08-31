"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchAllOnboardingTasksAdmin } from "@/lib/features/onboardingTasks/onboardingTaskSlice";


import PageContainer from "@/components/common/PageContainer";
import TaskHeader from "@/components/Admin/onboarding-tasks/TaskHeader";
import TaskTable from "@/components/Admin/onboarding-tasks/TaskTable";
import TaskFormModal from "@/components/Admin/onboarding-tasks/TaskFormModal";

const ALLOWED_ROLES = ["founder", "manager", "admin"];

export default function OnboardingTasksPage() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((state) => state.onboardingTasks.adminTasks);
  const loading = useAppSelector((state) => state.onboardingTasks.isAdminLoading);
  const currentUser = useAppSelector((state) => state.authUser?.user);

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOnboardingTasksAdmin());
  }, [dispatch]);

  if (currentUser && !ALLOWED_ROLES.includes(currentUser.role)) {
    redirect("/dashboard");
  }

  return (
    <PageContainer variant="dashboard">
      <div className="flex flex-col gap-6">
        <TaskHeader onCreateClick={() => setShowCreateModal(true)} />

        <TaskTable tasks={tasks} loading={loading} />
      </div>

      <TaskFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        task={null}
      />
    </PageContainer>
  );
}