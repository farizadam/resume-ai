import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import Interview from '@/models/Interview';
import connectDB from '@/lib/mongodb';
import { enhanceCandidateDataForAts } from '@/lib/ats-enhancer';
import { ResumeTemplate } from '@/components/pdf/ResumeTemplate';
import { migrateResumeData } from '@/lib/migrations';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const resolvedParams = await params;
        const interview = await Interview.findById(resolvedParams.id);
        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        let candidateData = migrateResumeData(interview.candidateData);

        const force = req.nextUrl.searchParams.get('force') === 'true';

        // Run ATS Optimization step if not already enhanced (or if forced) and if we actually have data
        const hasData = Object.keys(candidateData || {}).length > 0;
        
        if ((!interview.isEnhanced || force) && hasData) {
            const enhancedData = await enhanceCandidateDataForAts(candidateData);

            // Update MongoDB with the polished ATS-friendly data
            interview.candidateData = enhancedData;
            interview.isEnhanced = true;
            await interview.save();

            candidateData = enhancedData;
        }

        // Render polished data directly to vector PDF
        const pdfStream = await renderToStream(
            React.createElement(ResumeTemplate, { data: candidateData as any }) as any
        );

        return new NextResponse(pdfStream as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="ats-resume.pdf"',
            },
        });
    } catch (error: any) {
        console.error('Compilation Error:', error);
        return NextResponse.json({ error: 'Failed to compile ATS PDF' }, { status: 500 });
    }
}