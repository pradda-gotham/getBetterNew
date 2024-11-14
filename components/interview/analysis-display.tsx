"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  ChartBar,
  MessageSquare,
  Lightbulb,
  Waveform,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/ai-analysis";

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
}

export function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Analysis Results</h3>
          </div>
          <Badge variant="outline" className="text-lg">
            {analysis.score}%
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="overview">
              <ChartBar className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical">
              <Brain className="h-4 w-4 mr-2" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="behavioral">
              <MessageSquare className="h-4 w-4 mr-2" />
              Behavioral
            </TabsTrigger>
            <TabsTrigger value="communication">
              <Waveform className="h-4 w-4 mr-2" />
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Key Metrics</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technical Accuracy</span>
                      <span>{analysis.technical.accuracy}%</span>
                    </div>
                    <Progress value={analysis.technical.accuracy} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>{analysis.communication.clarity}%</span>
                    </div>
                    <Progress value={analysis.communication.clarity} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Confidence</span>
                      <span>{analysis.communication.confidence}%</span>
                    </div>
                    <Progress value={analysis.communication.confidence} />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-4">Quick Summary</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Overall sentiment: {analysis.sentiment.overall}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      {analysis.technical.keyPoints.length} key points covered
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Waveform className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">
                      Speaking pace: {Math.round(analysis.communication.pace)} words/min
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Key Recommendations</h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-1" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Technical Analysis</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{analysis.technical.accuracy}%</span>
                    </div>
                    <Progress value={analysis.technical.accuracy} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Depth</span>
                      <span>{analysis.technical.depth}%</span>
                    </div>
                    <Progress value={analysis.technical.depth} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Relevance</span>
                      <span>{analysis.technical.relevance}%</span>
                    </div>
                    <Progress value={analysis.technical.relevance} />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-4">Key Points Covered</h4>
                <div className="space-y-2">
                  {analysis.technical.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {analysis.technical.missingPoints.length > 0 && (
              <Card className="p-4">
                <h4 className="font-medium mb-4">Missing Points</h4>
                <div className="space-y-2">
                  {analysis.technical.missingPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                      <span className="text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Behavioral Traits</h4>
                <div className="space-y-4">
                  {analysis.behavioral.traits.map((trait, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{trait.name}</span>
                        <span>{trait.score}%</span>
                      </div>
                      <Progress value={trait.score} />
                      <p className="text-sm text-muted-foreground">
                        {trait.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Strengths</h4>
                  <div className="space-y-2">
                    {analysis.behavioral.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-4">Areas for Improvement</h4>
                  <div className="space-y-2">
                    {analysis.behavioral.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-1" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Communication Metrics</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span>{analysis.communication.clarity}%</span>
                    </div>
                    <Progress value={analysis.communication.clarity} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span>{analysis.communication.confidence}%</span>
                    </div>
                    <Progress value={analysis.communication.confidence} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Structure</span>
                      <span>{analysis.communication.structure}%</span>
                    </div>
                    <Progress value={analysis.communication.structure} />
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Speech Analysis</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Speaking Pace</span>
                      <Badge variant="outline">
                        {Math.round(analysis.communication.pace)} words/min
                      </Badge>
                    </div>
                    {analysis.communication.fillerWords.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Filler Words</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {analysis.communication.fillerWords.map((fw, index) => (
                            <Badge key={index} variant="secondary">
                              {fw.word}: {fw.count}x
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-4">Sentiment Analysis</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Sentiment</span>
                      <Badge
                        variant={
                          analysis.sentiment.overall === "POSITIVE"
                            ? "success"
                            : analysis.sentiment.overall === "NEGATIVE"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {analysis.sentiment.overall}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm">Confidence</span>
                      <Progress
                        value={analysis.sentiment.confidence * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}