import { PageContainer, PageHeader } from "@/components/common";
import ComingSoon from "@/components/common/ComingSoon";

export default function page() {
    return (
        <PageContainer variant="invictus">
            <PageHeader title="Reports" variant="invictus" />
            <ComingSoon
                variant="card"
                title="Revenue reports"
                className="mt-6"
            />
        </PageContainer>
    );
}
