/* eslint-disable react/prop-types */

import Style from "../Styles/modular/DataTravelLoader.module.css";

const DEFAULT_STEPS = [];

export default function DataTravelLoader({
    label = "Sending data",
    detail = "Waiting for server response...",
    steps = DEFAULT_STEPS,
    activeStep = 0,
    compact = false,
    className = "",
}) {
    const safeSteps = Array.isArray(steps) ? steps.filter(Boolean) : DEFAULT_STEPS;
    const currentStep = Number.isFinite(Number(activeStep))
        ? Math.max(0, Math.min(safeSteps.length - 1, Number(activeStep)))
        : 0;

    return (
        <div
            className={`${Style.loader} ${compact ? Style.compact : ""} ${className}`}
            data-nosnippet
        >
            <div className={Style.visual} aria-hidden="true">
                <span className={Style.node} />
                <span className={Style.route}>
                    <span className={Style.packetOne} />
                    <span className={Style.packetTwo} />
                    <span className={Style.packetThree} />
                </span>
                <span className={Style.node} />
            </div>

            <div className={Style.copy} role="status" aria-live="polite">
                <strong>{label}</strong>
                {detail && <span>{detail}</span>}
            </div>

            {safeSteps.length > 0 && (
                <ol className={Style.steps} aria-label="Loading progress">
                    {safeSteps.map((step, index) => (
                        <li
                            key={`${step}-${index}`}
                            className={`${index === currentStep ? Style.stepActive : ""} ${
                                index < currentStep ? Style.stepDone : ""
                            }`}
                        >
                            <span aria-hidden="true" />
                            {step}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
