export interface UniversityStudent {
    id: string;
    name: string;
    initials: string;
    impactScore: number;
    authenticityScore: number;
    contributionScore: number;
    placementStatus: "Ready" | "Moderate" | "Needs Improvement";
}

export interface UniversityTeam {
    id: string;
    name: string;
    impactScore: number;
    rank: number;
}

export interface UniversityData {
    students: UniversityStudent[];
    teams: UniversityTeam[];
    topContributors: UniversityStudent[];
    stats: {
        totalStudents: number;
        placementReady: number;
        avgImpact: number;
    };
}

export function getPlacementStatus(impactScore: number, contributionScore: number): "Ready" | "Moderate" | "Needs Improvement" {
    if (impactScore >= 80 && contributionScore >= 75) return "Ready";
    if (impactScore >= 50) return "Moderate";
    return "Needs Improvement";
}

export function getUniversityDemoData(): UniversityData {
    const students: UniversityStudent[] = [
        { id: "1", name: "Arjun Sharma", initials: "AS", impactScore: 89, authenticityScore: 94, contributionScore: 84, placementStatus: "Ready" },
        { id: "2", name: "Priya Nair", initials: "PN", impactScore: 82, authenticityScore: 91, contributionScore: 76, placementStatus: "Ready" },
        { id: "3", name: "Rohit Gupta", initials: "RG", impactScore: 74, authenticityScore: 85, contributionScore: 71, placementStatus: "Moderate" },
        { id: "4", name: "Sneha Patel", initials: "SP", impactScore: 68, authenticityScore: 88, contributionScore: 62, placementStatus: "Moderate" },
        { id: "5", name: "Vikram Singh", initials: "VS", impactScore: 45, authenticityScore: 70, contributionScore: 48, placementStatus: "Needs Improvement" },
        { id: "6", name: "Ananya Iyer", initials: "AI", impactScore: 91, authenticityScore: 96, contributionScore: 88, placementStatus: "Ready" },
        { id: "7", name: "Kabir Das", initials: "KD", impactScore: 55, authenticityScore: 78, contributionScore: 52, placementStatus: "Moderate" },
        { id: "8", name: "Meera Reddy", initials: "MR", impactScore: 79, authenticityScore: 82, contributionScore: 74, placementStatus: "Ready" },
    ];

    const teams: UniversityTeam[] = [
        { id: "t1", name: "Team Alpha (HealthTech)", impactScore: 88, rank: 1 },
        { id: "t2", name: "Neural Connect", impactScore: 84, rank: 2 },
        { id: "t3", name: "EcoTrack", impactScore: 79, rank: 3 },
        { id: "t4", name: "SmartCity IoT", impactScore: 72, rank: 4 },
        { id: "t5", name: "FinGuard AI", impactScore: 65, rank: 5 },
    ];

    return {
        students,
        teams,
        topContributors: students.slice(0, 5),
        stats: {
            totalStudents: 1200,
            placementReady: 450,
            avgImpact: 72
        }
    };
}
